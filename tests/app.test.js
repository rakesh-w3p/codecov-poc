const request = require('supertest')
const app = require('../src/app')

describe('Express App', () => {
  describe('GET /', () => {
    it('should return hello world message', async () => {
      const response = await request(app).get('/')
      
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ message: 'Hello World!' })
    })
  })

  describe('GET /health', () => {
    it('should return health check with status OK', async () => {
      const response = await request(app).get('/health')
      
      expect(response.status).toBe(200)
      expect(response.body.status).toBe('OK')
      expect(response.body).toHaveProperty('timestamp')
      expect(response.body).toHaveProperty('uptime')
      expect(typeof response.body.uptime).toBe('number')
    })

    it('should return valid timestamp format', async () => {
      const response = await request(app).get('/health')
      
      expect(response.status).toBe(200)
      const timestamp = new Date(response.body.timestamp)
      expect(timestamp).toBeInstanceOf(Date)
      expect(isNaN(timestamp.getTime())).toBe(false)
    })
  })

  describe('POST /users', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john.doe@example.com'
      }

      const response = await request(app)
        .post('/users')
        .send(userData)
      
      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('id')
      expect(response.body.name).toBe('John Doe')
      expect(response.body.email).toBe('john.doe@example.com')
      expect(response.body).toHaveProperty('createdAt')
    })

    it('should trim whitespace from name', async () => {
      const userData = {
        name: '  John Doe  ',
        email: 'john.doe@example.com'
      }

      const response = await request(app)
        .post('/users')
        .send(userData)
      
      expect(response.status).toBe(201)
      expect(response.body.name).toBe('John Doe')
    })

    it('should convert email to lowercase', async () => {
      const userData = {
        name: 'John Doe',
        email: 'JOHN.DOE@EXAMPLE.COM'
      }

      const response = await request(app)
        .post('/users')
        .send(userData)
      
      expect(response.status).toBe(201)
      expect(response.body.email).toBe('john.doe@example.com')
    })

    it('should return 400 when name is missing', async () => {
      const userData = {
        email: 'john.doe@example.com'
      }

      const response = await request(app)
        .post('/users')
        .send(userData)
      
      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Name and email are required')
    })

    it('should return 400 when email is missing', async () => {
      const userData = {
        name: 'John Doe'
      }

      const response = await request(app)
        .post('/users')
        .send(userData)
      
      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Name and email are required')
    })

    it('should return 400 when name is empty string', async () => {
      const userData = {
        name: '',
        email: 'john.doe@example.com'
      }

      const response = await request(app)
        .post('/users')
        .send(userData)
      
      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Name must be a non-empty string')
    })

    it('should return 400 when name is only whitespace', async () => {
      const userData = {
        name: '   ',
        email: 'john.doe@example.com'
      }

      const response = await request(app)
        .post('/users')
        .send(userData)
      
      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Name must be a non-empty string')
    })

    it('should return 400 when name is not a string', async () => {
      const userData = {
        name: 123,
        email: 'john.doe@example.com'
      }

      const response = await request(app)
        .post('/users')
        .send(userData)
      
      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Name must be a non-empty string')
    })

    it('should return 400 when email format is invalid', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email'
      }

      const response = await request(app)
        .post('/users')
        .send(userData)
      
      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Invalid email format')
    })

    it('should return 400 when email is missing @ symbol', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john.doeexample.com'
      }

      const response = await request(app)
        .post('/users')
        .send(userData)
      
      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Invalid email format')
    })

    it('should return 400 when email is missing domain', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john.doe@'
      }

      const response = await request(app)
        .post('/users')
        .send(userData)
      
      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Invalid email format')
    })
  })

  describe('GET /calculate/:operation/:a/:b', () => {
    describe('Addition', () => {
      it('should add two positive numbers', async () => {
        const response = await request(app).get('/calculate/add/5/3')
        
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
          operation: 'add',
          a: 5,
          b: 3,
          result: 8
        })
      })

      it('should add negative numbers', async () => {
        const response = await request(app).get('/calculate/add/-5/-3')
        
        expect(response.status).toBe(200)
        expect(response.body.result).toBe(-8)
      })

      it('should add decimal numbers', async () => {
        const response = await request(app).get('/calculate/add/1.5/2.3')
        
        expect(response.status).toBe(200)
        expect(response.body.result).toBeCloseTo(3.8)
      })
    })

    describe('Subtraction', () => {
      it('should subtract two numbers', async () => {
        const response = await request(app).get('/calculate/subtract/10/3')
        
        expect(response.status).toBe(200)
        expect(response.body.result).toBe(7)
      })

      it('should handle negative results', async () => {
        const response = await request(app).get('/calculate/subtract/3/10')
        
        expect(response.status).toBe(200)
        expect(response.body.result).toBe(-7)
      })
    })

    describe('Multiplication', () => {
      it('should multiply two numbers', async () => {
        const response = await request(app).get('/calculate/multiply/4/5')
        
        expect(response.status).toBe(200)
        expect(response.body.result).toBe(20)
      })

      it('should handle multiplication by zero', async () => {
        const response = await request(app).get('/calculate/multiply/5/0')
        
        expect(response.status).toBe(200)
        expect(response.body.result).toBe(0)
      })

      it('should handle negative multiplication', async () => {
        const response = await request(app).get('/calculate/multiply/-4/5')
        
        expect(response.status).toBe(200)
        expect(response.body.result).toBe(-20)
      })
    })

    describe('Division', () => {
      it('should divide two numbers', async () => {
        const response = await request(app).get('/calculate/divide/10/2')
        
        expect(response.status).toBe(200)
        expect(response.body.result).toBe(5)
      })

      it('should handle decimal division', async () => {
        const response = await request(app).get('/calculate/divide/7/3')
        
        expect(response.status).toBe(200)
        expect(response.body.result).toBeCloseTo(2.333333)
      })

      it('should return 400 for division by zero', async () => {
        const response = await request(app).get('/calculate/divide/5/0')
        
        expect(response.status).toBe(400)
        expect(response.body.error).toBe('Division by zero is not allowed')
      })
    })

    describe('Power', () => {
      it('should calculate power of two numbers', async () => {
        const response = await request(app).get('/calculate/power/2/3')
        
        expect(response.status).toBe(200)
        expect(response.body.result).toBe(8)
      })

      it('should handle power of zero', async () => {
        const response = await request(app).get('/calculate/power/5/0')
        
        expect(response.status).toBe(200)
        expect(response.body.result).toBe(1)
      })

      it('should handle negative exponents', async () => {
        const response = await request(app).get('/calculate/power/2/-2')
        
        expect(response.status).toBe(200)
        expect(response.body.result).toBe(0.25)
      })
    })

    describe('Error Cases', () => {
      it('should return 400 for invalid operation', async () => {
        const response = await request(app).get('/calculate/invalid/5/3')
        
        expect(response.status).toBe(400)
        expect(response.body.error).toBe('Invalid operation. Supported operations: add, subtract, multiply, divide, power')
      })

      it('should return 400 for non-numeric first parameter', async () => {
        const response = await request(app).get('/calculate/add/abc/3')
        
        expect(response.status).toBe(400)
        expect(response.body.error).toBe('Invalid numbers provided')
      })

      it('should return 400 for non-numeric second parameter', async () => {
        const response = await request(app).get('/calculate/add/5/xyz')
        
        expect(response.status).toBe(400)
        expect(response.body.error).toBe('Invalid numbers provided')
      })

      it('should return 400 for both parameters being non-numeric', async () => {
        const response = await request(app).get('/calculate/add/abc/xyz')
        
        expect(response.status).toBe(400)
        expect(response.body.error).toBe('Invalid numbers provided')
      })
    })
  })

  describe('404 Not Found', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route')
      
      expect(response.status).toBe(404)
      expect(response.body.error).toBe('Not found')
    })

    it('should return 404 for invalid HTTP methods', async () => {
      const response = await request(app).delete('/')
      
      expect(response.status).toBe(404)
      expect(response.body.error).toBe('Not found')
    })
  })
})