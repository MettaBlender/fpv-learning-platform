import {neon, neonConfig} from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)
neonConfig.fetchConnectionCache = true;

// export function get_components_with_options(options) {
//   return sql`SELECT json_agg(
//     json_build_object(
//       'id', b.id,
//       'name', b.name,
//       'price', b.price,
//       'shop', b.shop,
//       'description', b.description,
//       'link', b.link,
//       'imageurl', b.imageurl,
//       'options', (
//         SELECT json_agg(
//           json_build_object(
//             'id', bo.id,
//             'c_rate', bo.c_rate
//           )
//         )
//         FROM battery_options bo
//         WHERE bo.battery_id = b.id
//       )
//     )
//   ) AS result
//   FROM battery b`;
// }

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