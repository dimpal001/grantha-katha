// @ts-nocheck

import Api from '../utils/Api'

export async function fetchMostListenedAudio() {
  try {
    // const response = await Api.get('/audios', {
    //   page: '1,5',
    // })
    // return response

    const data = await fetch('/data/audiobook/audiobook.json')
    const audios = await data.json()

    return { result: audios.slice(0, 6), err: false }
  } catch (error) {
    console.error('Error :', error)
    return { result: [], err: true }
  }
}

export async function fetchAudios(searchQuery) {
  try {
    // const response = await Api.sql('/audios', {
    //   body: {
    //     params: [`%${searchQuery.trim()}%`],
    //     sql: 'SELECT * FROM audios WHERE name LIKE ? LIMIT 10',
    //   },
    // })
    // return response

    const data = await fetch('/data/audiobook/audiobook.json')
    const allAudios = await data.json()
    const query = searchQuery.trim().toLowerCase()

    const filtered = allAudios.filter((audio) =>
      audio.name?.toLowerCase().includes(query)
    )

    return { result: filtered.slice(0, 10), err: false }
  } catch (error) {
    console.error('Error :', error)
    return { result: [], err: true }
  }
}

export async function fetchAllAudios(category) {
  try {
    const data = await fetch('/data/audiobook/audiobook.json')
    const allAudios = await data.json()

    const filteredAudios =
      category && category !== 'All'
        ? allAudios.filter((audio) => audio.category === category)
        : allAudios

    return { result: filteredAudios, err: false }
  } catch (error) {
    console.error('Error:', error)
    return { result: [], err: true }
  }
}
