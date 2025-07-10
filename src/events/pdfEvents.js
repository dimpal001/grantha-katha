// @ts-nocheck

import Api from '../utils/Api'

export async function fetchMostViewedPDF() {
  try {
    // For production:
    // const response = await Api.get('/pdfs', {
    //   page: '1,5',
    // })
    // return response

    // Local JSON fallback
    const res = await fetch('/data/ebook/ebooks.json')
    let pdfs = await res.json()

    // Sort by views in descending order and return top 4
    pdfs.sort((a, b) => (b.views || 0) - (a.views || 0))
    return { result: pdfs.slice(0, 4), err: false }
  } catch (error) {
    console.error('Error :', error)
    return { result: [], err: true }
  }
}

export async function fetchPdfs(searchQuery) {
  try {
    // For production:
    // const response = await Api.sql('/pdfs', {
    //   body: {
    //     params: [`%${searchQuery.trim()}%`],
    //     sql: 'SELECT * FROM pdfs WHERE name LIKE ? LIMIT 10',
    //   },
    // })
    // return response

    const res = await fetch('/data/ebook/ebooks.json')
    const allPdfs = await res.json()
    const query = searchQuery.trim().toLowerCase()

    const filtered = allPdfs.filter((pdf) =>
      pdf.name?.toLowerCase().includes(query)
    )

    return { result: filtered.slice(0, 4), err: false }
  } catch (error) {
    console.error('Error :', error)
    return { result: [], err: true }
  }
}

export async function fetchAllPdfs() {
  try {
    const data = await fetch('/data/ebook/ebooks.json')
    const allPdfs = await data.json()

    return { result: allPdfs, err: false }
  } catch (error) {
    console.error('Error :', error)
    return { result: [], err: true }
  }
}
