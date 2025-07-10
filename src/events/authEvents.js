// @ts-nocheck

import Api from '../utils/Api'

export async function login(body) {
  try {
    const response = await Api.post('/auth-users', {
      body,
      fields: 'id, name, email',
    })
    return response
  } catch (error) {
    console.error('Error :', error)
    throw error
  }
}

export async function register(body) {
  try {
    const response = await Api.post('/users', {
      body,
    })
    return response
  } catch (error) {
    console.error('Error :', error)
    throw error
  }
}
