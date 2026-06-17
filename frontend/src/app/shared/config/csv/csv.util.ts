/**
 * Parser de CSV simples mas robusto: suporta campos entre aspas, vírgulas
 * dentro de aspas e aspas duplas escapadas (""). Devolve uma matriz de linhas,
 * cada uma com os seus campos.
 */
export function parseCsv(text: string, delimiter = ','): string[][] {
  const rows: string[][] = []
  let field = ''
  let row: string[] = []
  let inQuotes = false

  // Normaliza quebras de linha.
  const input = text.replace(/\r\n?/g, '\n')

  for (let i = 0; i < input.length; i++) {
    const char = input[i]

    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
    } else if (char === delimiter) {
      row.push(field)
      field = ''
    } else if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += char
    }
  }

  // Último campo/linha (se o ficheiro não terminar em newline).
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  // Remove linhas totalmente vazias.
  return rows.filter((r) => r.some((c) => c.trim() !== ''))
}
