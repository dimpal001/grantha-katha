// @ts-nocheck

import Api from '../utils/Api'

export async function fetchMostListenedAudio() {
  try {
    const response = await Api.get('/audios', {
      page: '1,5',
    })
    return response
  } catch (error) {
    console.error('Error :', error)
    throw error
  }
}

export async function fetchAudios(searchQuery) {
  try {
    const response = await Api.sql('/audios', {
      body: {
        params: [`%${searchQuery.trim()}%`],
        sql: 'SELECT * FROM audios WHERE name LIKE ? LIMIT 10',
      },
    })
    return response
  } catch (error) {
    console.error('Error :', error)
    throw error
  }
}
