import { PrismaClient } from "@prisma/client";
import * as xlsx from "xlsx";

const prisma = new PrismaClient();

function getCategory(desc: string) {
  desc = desc.toLowerCase();
  
  // 0. Combos y Kits (mayor prioridad, si es un combo armado no va a estéreos ni parlantes sueltos)
  if (desc.match(/\b(combo|combos|kit combo)\b/)) {
    return "COMBOS";
  }

  // 1. Cables, fichas y adaptadores (tienen prioridad porque suelen mencionar "estereo" en su nombre, ej: "Adaptador para estereo")
  if (desc.match(/\b(marco|adaptador|ficha|interface|interfaz|conector|cable|rca|fusible|distribuidor|terminal|relay|rele|manguera|cinta|y|kit de cables|kit de instalacion|instalacion)\b/)) {
    return "CABLEADO_ACCESORIOS";
  }

  // 2. Baterías y fuentes
  if (desc.match(/\b(bateria|batería|voltimetro|voltímetro|fuente|cargador)\b/)) {
    return "BATERIAS";
  }

  // 3. Estéreos y Pantallas
  if (desc.match(/\b(estereo|estéreo|stereo|pantalla|multimedia|reproductor|radio)\b/)) {
    return "ESTEREOS_PANTALLAS";
  }

  // 4. Subwoofers (antes que parlantes por si dice "parlante subwoofer")
  if (desc.match(/\b(subwoofer|woofer|bicho papao|cara preta|caja litrada)\b/)) {
    return "SUBWOOFERS";
  }

  // 5. Amplificadores y Procesadores
  if (desc.match(/\b(potencia|amplificador|dsp|crossover|ecualizador|eq)\b/)) {
    return "AMPLIFICADORES";
  }

  // 6. Parlantes, Medios y Drivers
  if (desc.match(/\b(parlante|componente|driver|tweeter|corneta|coaxial|6x9|6\.5|6,5|medio|tria|cuatria)\b/)) {
    return "PARLANTES_MEDIOS";
  }

  // Fallback
  return "ACCESORIOS";
}

async function main() {
  console.log("Descargando archivo Excel completo (todas las pestañas)...");
  
  const url = "https://docs.google.com/spreadsheets/d/1rYvUAIRMohC4uU3KaLlTM1EwFsQwuTMAnOQHEpsFsOg/export?format=xlsx";
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  
  console.log("Parseando Excel...");
  const workbook = xlsx.read(arrayBuffer, { type: "array" });
  
  // Limpiamos la base de datos actual antes de reinsertar todo
  await prisma.product.deleteMany({});
  console.log("Base de datos limpia.");

  let count = 0;

  for (const sheetName of workbook.SheetNames) {
    console.log(`Procesando pestaña: ${sheetName}`);
    const sheet = workbook.Sheets[sheetName];
    // Formato de arreglo de arreglos para ver las celdas
    const rows = xlsx.utils.sheet_to_json<any[]>(sheet, { header: 1 });
    
    for (const row of rows) {
      if (!row || row.length < 3) continue;
      
      // La columna 0 o 1 suele tener el '*', fecha o codigo.
      // Buscamos alguna celda que parezca un código y una que tenga descripción.
      // Basado en el CSV anterior: la descripción está y el precio (Gremio2) suele estar al final.
      
      const lineStr = row.join(" ");
      if (lineStr.includes("LIQUIDACION") || lineStr.includes("NOVEDAD") || lineStr.includes("reposicion") || lineStr.includes("OFERTA") || String(row[0]).includes("*")) {
        
        // Encontrar descripción (texto largo) y precio (número)
        let description = "";
        let priceVal = 0;
        
        for (let i = 0; i < row.length; i++) {
          const cell = row[i];
          if (typeof cell === "string" && cell.length > 15) {
            description = cell;
          }
          if (typeof cell === "number" && cell > 0) {
            priceVal = cell;
          } else if (typeof cell === "string" && cell.includes("$")) {
            const parsed = parseFloat(cell.replace(/\$/g, "").replace(/\./g, "").replace(/,/g, "."));
            if (!isNaN(parsed)) priceVal = parsed;
          }
        }

        if (description && priceVal > 0) {
          const name = description.split("|")[0].split("/")[0].split("\n")[0].trim();
          
          // Parse Technical Specs
          let rms = null;
          let impedance = null;
          let channels = null;
          
          const lowerDesc = description.toLowerCase();
          
          // Match RMS (e.g. 800rms, 800 rms, 800 wrms)
          const rmsMatch = lowerDesc.match(/(\d+)\s*w?rms/);
          if (rmsMatch) rms = parseInt(rmsMatch[1], 10);
          
          // Match Impedance (e.g. 2 ohms, 4 ohms, D2, D4)
          const impMatch = lowerDesc.match(/(\d+)\s*ohm/);
          if (impMatch) impedance = impMatch[1];
          if (lowerDesc.includes("doble bobina") || lowerDesc.includes(" d4 ")) impedance = "D4";
          if (lowerDesc.includes(" d2 ")) impedance = "D2";
          
          // Match Channels (e.g. 4 canales, 1 canal, monoblock)
          const chMatch = lowerDesc.match(/(\d+)\s*canal/);
          if (chMatch) channels = parseInt(chMatch[1], 10);
          if (lowerDesc.includes("monoblock")) channels = 1;

          try {
            await prisma.product.create({
              data: {
                name: name.substring(0, 200),
                description: description,
                price: priceVal,
                category: getCategory(description),
                stock: 10,
                rms: rms,
                impedance: impedance,
                channels: channels
              }
            });
            count++;
          } catch (e) {
            console.error("Error creando:", name, e);
          }
        }
      }
    }
  }
  
  console.log(`¡Éxito! Se importaron ${count} productos en total de todas las pestañas.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
