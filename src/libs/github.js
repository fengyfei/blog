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

const BaseURL = 'https://api.github.com'

const Github = {
  Issues: '/repos/fengyfei/blog/issues?state=open',
  Map: '/repos/fengyfei/blog/issues?state=close'
}

export async function mapIssues () {
  try {
    let resp = await wepy.request({url: BaseURL + Github.Map})

    if (resp.statusCode === 200) {
      let images = []

      resp.data.forEach((el) => {
        if (el.state === 'closed') {
          JSON.parse(el.body).map.forEach((item) => {
            images.push(item.url)
          })
        }
      })

      return images
    }

    return []
  } catch (e) {
    console.log(e)

    return []
  }
}

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

        issues.unshift({
          title: el.title,
          created: moment(el.created_at).format('YYYY-MM-DD HH:mm:SS'),
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
