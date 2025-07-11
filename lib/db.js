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
      data.imageurl || null,
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

export async function update_component(data) {
  const ALLOWED_COMPONENTS = ["frame", "motors", "esc", "fc", "props", "battery", "camera"]

  if (!data.component || !ALLOWED_COMPONENTS.includes(data.component)) {
    throw new Error(
      `Ungültiger Komponententyp: ${data.component}. Erlaubte Typen sind: ${ALLOWED_COMPONENTS.join(", ")}`,
    )
  }

  const tableName = data.component

  console.log("Aktualisiere Komponente:", data)

  const requiredFields = ["name", "price", "shop", "id"]
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Fehlendes Pflichtfeld: ${field}`)
    }
  }

  try {
    const optionsJson = data.options ? JSON.stringify(data.options) : null

    const query = `
      UPDATE "${tableName}"
      SET name = $1,
        price = $2,
        shop = $3,
        description = $4,
        link = $5,
        imageurl = $6,
        options = $7
      WHERE id = $8
      RETURNING id, name, price
    `

    const result = await sql.query(query, [
      data.name,
      data.price,
      data.shop,
      data.description || null,
      data.link || null,
      data.imageurl || null,
      optionsJson,
      data.id
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

export async function update_component_price(data) {
  const ALLOWED_COMPONENTS = ["frame", "motors", "esc", "fc", "props", "battery", "camera"]

  if (!data.component || !ALLOWED_COMPONENTS.includes(data.component)) {
    throw new Error(
      `Ungültiger Komponententyp: ${data.component}. Erlaubte Typen sind: ${ALLOWED_COMPONENTS.join(", ")}`,
    )
  }

  const tableName = data.component

  console.log("Aktualisiere Komponente:", data)

  const requiredFields = ["price", "link", "id"]
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Fehlendes Pflichtfeld: ${field}`)
    }
  }

  try {
    const query = `
      UPDATE "${tableName}"
      SET price = $1
      WHERE id = $2 AND link = $3
      RETURNING id, name, price
    `

    const result = await sql.query(query, [
      data.price,
      data.id,
      data.link,
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
    throw new Error(`Fehler beim updaten des Komponenten preises: ${error.message || error}`)
  }
}


export const add_build = async (component) => {
  const data = component.components;
  console.log("Daten für den Build:", data, data.frame, data.battery, data.camera, data.esc, data.fc, data.motors, data.props);
  if (!data
      || !data.frame
      || !data.battery
      || !data.camera
      || !data.esc
      || !data.fc
      || !data.motors
      || !data.props) {
    throw new Error("Fehlende erforderliche Felder")
  }

  console.log("Füge Build hinzu mit den Komponenten:", data, data.frame, data.battery, data.camera, data.esc, data.fc, data.motors, data.props)

  const response = await sql`
    INSERT INTO builds (frame_id, battery_id, camera_id, esc_id, fc_id, motors_id, props_id)
    VALUES (${data.frame}, ${data.battery}, ${data.camera}, ${data.esc}, ${data.fc}, ${data.motors}, ${data.props})
    RETURNING id
  `

  console.log("Build-Daten:", response)
  return { success: true, message: "Build erfolgreich hinzugefügt" }
}

export const get_all_builds = async () => {
  const response = await sql`
    SELECT
        b.id AS build_id,
        json_build_object(
            'id', f.id,
            'name', f.name,
            'price', f.price,
            'shop', f.shop,
            'description', f.description,
            'link', f.link,
            'imageurl', f.imageurl,
            'options', f.options
        ) AS frame,
        json_build_object(
            'id', bat.id,
            'name', bat.name,
            'price', bat.price,
            'shop', bat.shop,
            'description', bat.description,
            'link', bat.link,
            'imageurl', bat.imageurl,
            'options', bat.options
        ) AS battery,
        json_build_object(
            'id', c.id,
            'name', c.name,
            'price', c.price,
            'shop', c.shop,
            'description', c.description,
            'link', c.link,
            'imageurl', c.imageurl,
            'options', c.options
        ) AS camera,
        json_build_object(
            'id', e.id,
            'name', e.name,
            'price', e.price,
            'shop', e.shop,
            'description', e.description,
            'link', e.link,
            'imageurl', e.imageurl,
            'options', e.options
        ) AS esc,
        json_build_object(
            'id', fc.id,
            'name', fc.name,
            'price', fc.price,
            'shop', fc.shop,
            'description', fc.description,
            'link', fc.link,
            'imageurl', fc.imageurl,
            'options', fc.options
        ) AS fc,
        json_build_object(
            'id', m.id,
            'name', m.name,
            'price', m.price,
            'shop', m.shop,
            'description', m.description,
            'link', m.link,
            'imageurl', m.imageurl,
            'options', m.options
        ) AS motors,
        json_build_object(
            'id', p.id,
            'name', p.name,
            'price', p.price,
            'shop', p.shop,
            'description', p.description,
            'link', p.link,
            'imageurl', p.imageurl,
            'options', p.options
        ) AS props
    FROM builds b
    LEFT JOIN frame f ON b.frame_id = f.id
    LEFT JOIN battery bat ON b.battery_id = bat.id
    LEFT JOIN camera c ON b.camera_id = c.id
    LEFT JOIN esc e ON b.esc_id = e.id
    LEFT JOIN fc ON b.fc_id = fc.id
    LEFT JOIN motors m ON b.motors_id = m.id
    LEFT JOIN props p ON b.props_id = p.id;
  `

  return response;
}

export const update_build = async (component) => {
  const data = component;
  console.log("Daten für den Build:", data, data.frame, data.battery, data.camera, data.esc, data.fc, data.motors, data.props);
  if (!data
      || !data.frame
      || !data.battery
      || !data.camera
      || !data.esc
      || !data.fc
      || !data.motors
      || !data.props) {
    throw new Error("Fehlende erforderliche Felder")
  }

  console.log("Füge Build hinzu mit den Komponenten:", data, data.frame, data.battery, data.camera, data.esc, data.fc, data.motors, data.props)

  const response = await sql`
    UPDATE builds SET frame_id = ${data.frame.id}, battery_id = ${data.battery.id}, camera_id = ${data.camera.id}, esc_id = ${data.esc.id},
    fc_id = ${data.fc.id}, motors_id = ${data.motors.id}, props_id = ${data.props.id}
    WHERE id = ${data.build_id}
    RETURNING id
  `

  console.log("Build-Daten:", response)
  return { success: true, message: "Build erfolgreich hinzugefügt" }
}

export const delete_build = async (id) => {
  if (!id) {
    throw new Error("Fehlende ID")
  }

  console.log("Lösche Build mit ID:", id)

  const response = await sql`
    DELETE FROM builds WHERE id = ${id}
    RETURNING id
  `

  if (response.length === 0) {
    throw new Error("Build nicht gefunden")
  }

  console.log("Build gelöscht:", response)
  return { success: true, message: "Build erfolgreich gelöscht" }
}