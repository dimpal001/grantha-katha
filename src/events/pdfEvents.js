// @ts-nocheck

import Api from '../utils/Api'

export async function fetchMostViewedPDF() {
  try {
    const response = await Api.get('/pdfs', {
      page: '1,5',
    })
    return response
  } catch (error) {
    console.error('Error :', error)
    throw error
  }
}

export async function fetchPdfs(searchQuery) {
  try {
    const response = await Api.sql('/pdfs', {
      body: {
        params: [`%${searchQuery.trim()}%`],
        sql: 'SELECT * FROM pdfs WHERE name LIKE ? LIMIT 10',
      },
    })
    return response
  } catch (error) {
    console.error('Error :', error)
    throw error
  }
}
