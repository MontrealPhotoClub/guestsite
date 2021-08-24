export default async (req, res) => {
  if (req.method === 'POST') {
    await fetch(
      'https://track.customer.io/api/v1/forms/next-signup-en/submit',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Basic ${process.env.NEXT_PUBLIC_CIO_TRACK_KEY}`,
        },
        body: JSON.stringify({
          data: { email: `${req.body.email}`, language: 'fr' },
        }),
      }
    )

    console.log('Submission sent!')

    return res.status(200).end()
  }
  return res.status(500).end()
}
