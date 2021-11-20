import { InferGetStaticPropsType, NextPage } from 'next'
import { getPosts, getPost } from '../../../../../utils/api'
import MarkdownIt from 'markdown-it'

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
    props: getPost(params.author, params.slug)
  }
}

const index: NextPage<Props> = (props) => {
  const md = new MarkdownIt()
  return (
    <div>
      <h2>{ props.title }</h2>
      <div>Author: { props.author }</div>
      <div dangerouslySetInnerHTML={{ __html: md.render(props.content) }}></div>
    </div>
  )
}

export default index;
