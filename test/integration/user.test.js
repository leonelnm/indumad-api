import supertest from 'supertest'
import app from '../../src/app.js'

const api = supertest(app)

const baseUrl = '/api/v1'

describe('Test de integración', () => {
  test('Devuelve un status 200', async () => {
    await api.get(`${baseUrl}/user/1`).expect(200)
  })
})
