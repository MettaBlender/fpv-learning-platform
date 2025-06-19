import {neon, neonConfig} from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)
neonConfig.fetchConnectionCache = true;

export function get_components_with_options(options = {}) {
  // Konvertiere das options-Objekt in JSONB für die Filterung
  const optionsJson = JSON.stringify(options);

  return sql`
    SELECT json_agg(json_build_object(
      'battery', (SELECT json_agg(row_to_json(b)) FROM battery b),
      'camera', (SELECT json_agg(row_to_json(c)) FROM camera c),
      'esc', (SELECT json_agg(row_to_json(e)) FROM esc e),
      'fc', (SELECT json_agg(row_to_json(f)) FROM fc f),
      'frame', (SELECT json_agg(row_to_json(fr)) FROM frame fr),
      'motors', (SELECT json_agg(row_to_json(m)) FROM motors m),
      'props', (SELECT json_agg(row_to_json(p)) FROM props p)
    )) AS components
  `;
}

export async function add_component(data) {
  const ALLOWED_COMPONENTS = ["frame", "motors", "esc", "fc", "props", "battery", "camera"]

  if (!data.component || !ALLOWED_COMPONENTS.includes(data.component)) {
    throw new Error(
      `Ungültiger Komponententyp: ${data.component}. Erlaubte Typen sind: ${ALLOWED_COMPONENTS.join(", ")}`,
    )
  }

  const tableName = data.component

  const requiredFields = ["name", "price", "shop"]
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Fehlendes Pflichtfeld: ${field}`)
    }
  }

  try {
    const optionsJson = data.options ? JSON.stringify(data.options) : null

    const query = `
      INSERT INTO "${tableName}" (name, price, shop, description, link, imageurl, options)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, price
    `

    const result = await sql.query(query, [
      data.name,
      data.price,
      data.shop,
      data.description || null,
      data.link || null,
      data.imageUrl || null,
      optionsJson,
    ])

    // *** NEUE DEBUGGING-AUSGABE ***
    console.log("Ergebnis der SQL-Abfrage:", result)

    // Überprüfe, ob result.rows existiert und nicht leer ist
    if (!result) {
      throw new Error("Die Einfügeoperation hat keine Zeilen zurückgegeben.")
    }

    return result[0]
  } catch (error) {
    // *** VERBESSERTE FEHLERPROTOKOLLIERUNG ***
    console.error("Datenbankfehler (vollständiges Objekt):", error)
    throw new Error(`Fehler beim Hinzufügen der Komponente: ${error.message || error}`)
  }
}

export async function delete_component(type, id) {
  const ALLOWED_COMPONENTS = ["frame", "motors", "esc", "fc", "props", "battery", "camera"]

  if (!type || !ALLOWED_COMPONENTS.includes(type)) {
    throw new Error(
      `Ungültiger Komponententyp: ${type}. Erlaubte Typen sind: ${ALLOWED_COMPONENTS.join(", ")}`,
    )
  }

  const tableName = type

  try {

    const query = `DELETE FROM "${tableName}" WHERE id = $1`

    const result = await sql.query(query, [id])

    // *** NEUE DEBUGGING-AUSGABE ***
    console.log("Ergebnis der SQL-Abfrage:", result)

    // Überprüfe, ob result.rows existiert und nicht leer ist
    if (!result) {
      throw new Error("Die Einfügeoperation hat keine Zeilen zurückgegeben.")
    }

    return true
  } catch (error) {
    // *** VERBESSERTE FEHLERPROTOKOLLIERUNG ***
    console.error("Datenbankfehler (vollständiges Objekt):", error)
    throw new Error(`Fehler beim Löschen der Komponente: ${error.message || error}`)
  }
}