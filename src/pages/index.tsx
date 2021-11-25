import { InferGetStaticPropsType, NextPage } from 'next'
import Link from 'next/link'
import { getPosts } from '../utils/api'

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export const getStaticProps = () => {
  const posts = getPosts()
  return {
    props: {
      posts
    }
  }
}

const Home: NextPage<Props> = (props) => {
  return (
    <div>
       <div>
         記事一覧
       </div>
       <div>
         <ul>
           {props.posts.map((post) => (
             <li key={post.title}>
               {post.title}
               <ul>
                 <li>
                   <Link href={`/authors/${post.author}/posts/${post.slug}`}>
                     {post.author + "の" + post.slug}
                   </Link>
                 </li>
                 <li>
                   <Link href={`/authors/${post.author}`}>
                     {post.author + "のページ"}
                   </Link>
                 </li>
               </ul>
             </li>
           ))}
         </ul>
       </div>
     </div>
   )
 }

export default Home
