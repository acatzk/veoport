import Moment from 'react-moment'
import Head from 'next/head'
import Layout from '~/layouts/default'
import Link from 'next/link'
import useSWR from 'swr'
import { GraphQLClient } from 'graphql-request'
import { GET_BLOG_POSTS_QUERY } from '~/graphql/queries'

const graphcms = new GraphQLClient(process.env.GRAPHQL_URL_ENDPOINT)

export async function getStaticProps() {
  const initialData = await graphcms.request(GET_BLOG_POSTS_QUERY)
  return {
    props: {
      initialData
    }
  }
}

export default function Others({ initialData }) {
  const { data } = useSWR(GET_BLOG_POSTS_QUERY, (query) => graphcms.request(query), {
    initialData,
    revalidateOnMount: true
  })
  return (
    <>
      <Head>
        <title>Blog</title>
      </Head>
      <Layout>
        <div className="flex flex-col items-center h-screen w-full pt-5">
          <div className="flex flex-col pb-20 space-y-3">
            {data.posts.map((post) => {
              const postTags = post.tags
              return (
                <Link key={post.id} as={`/post/${post.slug}`} href="/post/[slug]">
                  <a className="flex flex-col items-center w-full">
                    <div className="flex flex-col md:flex-row justify-start items-start rounded-md h-auto md:h-60 overflow-y-hidden shadow-md bg-gray-100 dark:bg-gray-900 w-full md:w-9/12 transition ease-in-out duration-300 md:transform hover:translate-x-2">
                      <div className="flex w-full">
                        <img className="w-full md:w-11/12 h-60 my-auto rounded-t-md md:rounded-l-md md:rounded-r-none object-cover bg-gray-300 dark:bg-gray-800" src={post.coverImage.url} alt={post.title} />
                      </div>
                      <div className="flex flex-col justify-between w-full h-full py-3 md:py-8 px-5 md:-px-5 md:px-0 space-y-3 md:space-y-1">
                        <div className="space-y-2 w-full">
                          <h1 className="font-bold text-xl">{post.title}</h1>
                          <p className="font-light text-sm">{post.excerpt}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex flex-row space-x-1">
                            {postTags.map((tag) => <p className="font-semibold text-xs px-1.5 py-0.5 rounded-full bg-[#0D8CD9] text-[#B5E0FB] flex flex-row items-center">{tag}</p>)}
                          </div>
                         <div>
                          <p className="font-semibold text-sm">{post.author.name}</p>
                          <p className="font-ligth text-xs text-gray-500">
                            <Moment date={post.date} format="MMMM DD, YYYY" />
                          </p>
                         </div>
                        </div>
                      </div>   
                      <div className="hidden md:flex flex-col h-full justify-center mx-10">
                        <svg className="w-10 h-10 fill-current text-[#333] dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd"></path><path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                      </div> 
                    </div>
                  </a> 
                </Link>
              )
            })}
          </div>
        </div>
      </Layout>
    </>
  );
}
