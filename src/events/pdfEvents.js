// @ts-nocheck

import { useAuthUser } from '$lib/authUser'
import { favouriteStore } from '../stores/appStore'
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

export async function toggleFavourite(ravourite, ebook) {
  try {
    const user = useAuthUser()
    if (ravourite) {
      const response = await Api.delete(`/favourites/${ravourite.id}`)

      favouriteStore.update((previous) =>
        previous.filter((item) => item.id != ravourite.id)
      )

      return response
    }
    const response = await Api.post(`/favourites`, {
      body: {
        book: ebook.id,
        user: user.id,
        type: 'ebook',
      },
      fields: 'id, user, book',
    })

    const newFavourite = await Api.get(
      `/favourites/${response.result.lastInsertID}`
    )

    favouriteStore.update((previous) => [...previous, newFavourite.result[0]])

    return response
  } catch (error) {
    console.error('Error:', error)
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
