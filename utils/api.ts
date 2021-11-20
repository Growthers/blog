import glob from 'glob'
import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const postsDirectory = join(process.cwd(), 'articles')

type articleInfo = {
  title: string,
  author: string,
  slug: string,
  content: string
}

export const getPost = (author: string, slug: string) => {
  const fullPath = join(postsDirectory, author, slug, "index.md")
  const fileContents = fs.readFileSync(fullPath, "utf-8")

  var info: articleInfo = {
    title: getPostMeta(fileContents),
    author: author,
    slug: slug,
    content: fileContents
  }

  return info
}

export const getPosts = () => {
  var slugs = glob.sync(`*/*/`, { cwd: postsDirectory });
  var posts: articleInfo[] = []
  slugs.map((post) => {
    const [ author, slug ] = post.split("/")

    posts.push(getPost(author, slug))
  })
  return posts
}

const getPostMeta = (fileContents: string) => {
  const { data } = matter(fileContents)
  return data.title
}

