import React from 'react'
import { useRouter } from 'next/router'

const index: React.FC = () => {
  const router = useRouter()
  const { author } = router.query

  return (
    <div>
      <h2>{author}のプロフィール</h2>
    </div>
  )
}

export default index;
