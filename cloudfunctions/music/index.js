// 云函数入口文件
const cloud = require('wx-server-sdk')

const rp = require('request-promise')

const TcbRouter = require('tcb-router')


const BASE_URL = 'https://www.sovendea.icu'

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  const app = new TcbRouter({
    event
  })

  app.router('search', async(ctx, next) => {
    console.log(parseInt(event.keyword))
    ctx.body = await rp(BASE_URL + '/search?keywords=' + encodeURI(event.keyword))
      .then((res) => {
        return JSON.parse(res)
      })
  })

  app.router('playlist', async(ctx, next) => {
    ctx.body = await db.collection('playlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy('trackNumberUpdateTime', 'desc')
      .get()
      .then((res) => {
        return res
      }).catch((err) => {
        return err
      })
  })

  app.router('musiclist', async(ctx, next) => {
    ctx.body = await rp(BASE_URL + '/playlist/detail?id=' + parseInt(event.playlistId))
      .then((res) => {
        return JSON.parse(res)
      })
  })

  app.router('musicUrl', async(ctx, next) => {
    ctx.body = await rp(BASE_URL + `/song/url?id=${event.musicId}`)
    .then((res) => {
      return res
    })
  })

  app.router('lyric', async(ctx,next)=>{
    ctx.body = await rp(BASE_URL + `/lyric?id=${event.musicId}`).then((res)=>{
      return res
    })
  })

  return app.serve()

}