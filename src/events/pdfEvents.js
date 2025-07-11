// @ts-nocheck

import Api from '../utils/Api'

export async function fetchMostViewedPDF() {
  try {
    // const response = await Api.get('/pdfs', {
    //   page: '1,5',
    // })
    // return response

    const res = await fetch('/data/ebook/ebooks.json')
    let pdfs = await res.json()

    return { result: pdfs.slice(0, 4), err: false }
  } catch (error) {
    console.error('Error :', error)
    return { result: [], err: true }
  }
}

export async function fetchPdfs(searchQuery) {
  try {
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
export async function fetchAllPdfs(category) {
  try {
    const data = await fetch('/data/ebook/ebooks.json')
    const allPdfs = await data.json()

    const filteredPdfs =
      category && category !== 'All'
        ? allPdfs.filter((pdf) => pdf.category === category)
        : allPdfs

    return { result: filteredPdfs, err: false }
  } catch (error) {
    console.error('Error:', error)
    return { result: [], err: true }
  }
}
