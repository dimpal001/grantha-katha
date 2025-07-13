// @ts-nocheck

import { useAuthUser } from '$lib/authUser'
import Api from '../utils/Api'
import bcrypt from 'bcryptjs'

export async function login(body) {
  try {
    const userResponse = await Api.get(`/users`, {
      search: `email:${body.email}`,
    })
    const user = userResponse?.result[0]

    if (!user) {
      return {
        err: true,
        result: 'No account found with this email address.',
      }
    }

    const isMatch = await bcrypt.compare(body.password, user.password)

    if (!isMatch) {
      return {
        err: true,
        result: 'The entered passwords do not match.',
      }
    } else {
      const response = await Api.post('/auth-users', {
        body: {
          email: body.email,
          password: user.password,
        },
        fields: 'id, name, email',
      })
      return response
    }
  } catch (error) {
    console.error('Error :', error)
    throw error
  }
}

export async function register(body) {
  try {
    const hashedPassword = await bcrypt.hash(body.password, 10)

    const response = await Api.post('/users', {
      body: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
      },
    })
    return response
  } catch (error) {
    console.error('Error :', error)
    throw error
  }
}

export async function sendOtp(email) {
  try {
    const userResponse = await Api.get('/users', { search: `email:${email}` })
    const user = userResponse.result?.[0]

    if (!user) {
      return { err: true, result: 'No account found with this email address.' }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    await Api.put(`/users/${user.id}`, {
      body: { otp },
      fields: 'name',
    })

    const body = {
      from: {
        name: 'Grantha Katha',
        email: 'connecteng@arodos.com',
      },
      to: [
        {
          name: user.name || 'Grantha Katha User',
          email,
        },
      ],
      subject: 'Your OTP for Password Reset',
      textpart: `Your OTP is: ${otp}`,
      htmlpart: `<p>Your <strong>OTP</strong> for resetting your password is: <b>${otp}</b></p><p>This OTP is valid for 10 minutes.</p>`,
    }

    const emailResponse = await fetch(
      'https://send-email-api-v4.backendservices.in',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    const emailResult = await emailResponse.json()
    console.log('Email sent response:', emailResult)

    return {
      err: false,
      result: 'OTP has been sent to your email address.',
    }
  } catch (error) {
    console.error('Error in sendOtp:', error)
    return {
      err: true,
      result: 'Something went wrong while sending the OTP email.',
    }
  }
}

export async function verifyOtpAndUpdatePassword(email, otp, password) {
  try {
    const userResponse = await Api.get('/users', { search: `email:${email}` })
    const user = userResponse.result?.[0]

    if (user.otp != otp.toString()) {
      return {
        err: true,
        result: 'The OTP you entered is incorrect or expired.',
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await Api.put(`/users/${user.id}`, {
      body: { otp: '', password: hashedPassword },
    })

    return {
      err: false,
      result: 'Your password has been reset successfully. Please log in.',
    }
  } catch (error) {
    console.error('Error in updating password:', error)
    return {
      err: true,
      result:
        'An error occurred while resetting your password. Please try again.',
    }
  }
}
