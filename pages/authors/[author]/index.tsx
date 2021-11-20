import { InferGetStaticPropsType, NextPage } from 'next'
import { getPosts } from '../../../utils/api'

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticPaths = () => {
  const posts = getPosts()

  return {
    paths: posts.map((post) => {
      return {
        params: {
          author: post.author,
          slug: post.slug
        }
      }
    }),
    fallback: false
  }
}

export const getStaticProps = ({ params }: any) => {
  return {
    props: {
      author: params.author
    }
  }
}

const index: NextPage<Props> = (props) => {
  return (
    <div>
      <h2>{ props.author }のページ</h2>
    </div>
  )
}

export default index;
