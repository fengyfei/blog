/*
 * MIT License
 *
 * Copyright (c) 2017 Feng Yifei.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/*
 * Revision History:
 *     Initial: 2017/08/08        Feng Yifei
 */

import wepy from 'wepy'
import moment from 'moment'

const accessToken = '7d0888fd5c1c386610f7306707fb3638d944dcee'
const BaseURL = 'https://api.github.com'

const Github = {
  Issues: `/repos/fengyfei/blog/issues?access_token=${accessToken}&state=open&creator=fengyfei`,
  Index: `/repos/fengyfei/blog/issues/2?access_token=${accessToken}`,
  Mine: `/repos/fengyfei/blog/issues/5?access_token=${accessToken}`,
  Popular: `/search/repositories?access_token=${accessToken}`
}

// 获取 issues 对应的图片
export async function mapIssues () {
  try {
    let resp = await wepy.request({url: BaseURL + Github.Index})

    if (resp.statusCode === 200) {
      let last = ''
      let images = []
      let mapImage = []

      // 解析 json 数据
      let data = JSON.parse(resp.data.body)

      last = data.last
      mapImage = data.map

      let issues = (await listIssues())[0]

      for (let i = 0; i < issues.length; i++) {
        for (let j = 0; j < mapImage.length; j++) {
          if (issues[i].number === mapImage[j].id) {
            images.push(mapImage[j].url)
            break
          }
        }
        if (!images[i]) {
          images.unshift('')
        }
      }

      try {
        wepy.setStorageSync('lastUpdated', data.last)
      } catch (e) {
        console.log(e)
      }

      return [images, last]
    }

    return []
  } catch (e) {
    console.log(e)

    return []
  }
}

// 获取 issues 列表
export async function listIssues () {
  try {
    let resp = await wepy.request({url: BaseURL + Github.Issues})

    if (resp.statusCode === 200) {
      let issues = []

      resp.data.forEach((el) => {
        let labels = []

        el.labels.forEach((l) => {
          labels.push(l.name)
        })

        // 将数据存入变量 issues
        issues.push({
          title: el.title,
          number: el.number,
          created: moment(el.created_at).format('YYYY-MM-DD HH:mm:ss'),
          labels: (labels.length === 0) ? '' : labels.join(','),
          body: el.body,
          url: el.url
        })
      })

      return [issues, 0]
    }

    return [[], 1]
  } catch (e) {
    console.log(e)

    return [[], 1]
  }
}

// 获取个人信息
export async function mine () {
  try {
    let resp = await wepy.request({url: BaseURL + Github.Mine})

    if (resp.statusCode === 200) {
      // 解析 json 数据
      let userInfo = JSON.parse(resp.data.body).info

      return userInfo
    }

    return {}
  } catch (e) {
    console.log(e)

    return {}
  }
}

// 获取 Github 上星数最多的项目
export async function getPopular (language, page) {
  try {
    let resp = await wepy.request({url: BaseURL + Github.Popular + '&q=language:' + language + '&sort=stars&page=' + page})

    if (resp.statusCode === 200) {
      return [resp.data.items, 0]
    }

    return [[], 1]
  } catch (e) {
    console.log(e)

    return [[], 1]
  }
}
