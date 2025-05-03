import axios from 'axios'

export async function analisarDocumentoComGoogleVision(file) {
  const apiKey = "AIzaSyCIE7EtLRq_H8WbCdIvn2b6yORY7-rWZhs" // substitua pela sua chave
  const base64 = await toBase64(file)

  const requestBody = {
    requests: [
      {
        image: {
          content: base64.split(',')[1] // remove prefixo "data:image/png;base64,"
        },
        features: [
          {
            type: 'TEXT_DETECTION'
          }
        ]
      }
    ]
  }

  const response = await axios.post(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    requestBody
  )

  const texto = response.data.responses[0]?.fullTextAnnotation?.text
  if (!texto) {
    throw new Error('Texto não detectado pelo Google Vision.')
  }

  return texto.toLowerCase()
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}