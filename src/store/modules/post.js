import axios from 'axios'

const dummyPosts = []
for (let i = 0; i < 5; i++) {
  dummyPosts.push({
    _id: (Math.random() + i).toString().substring(7),
    author: {
      _id: (Math.random() + i).toString().substring(7),
      roles: ['ADMIN'],
      nickname: 'master',
    },
    menu: {
      _id: (Math.random() + i).toString().substring(7),
      owner: 'sol',
      subject: 'album',
      category: '',
    },
    postNum: i,
    title: '제목' + i,
    content: '민규 죽어. 반박없음 반박있을시 루비도 같이 죽임',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isPublic: false,
    viewCount: i,
    likeCount: i,
    comment: i,
    tag: ['루비바보', '루빙', '치즈', '토리', '밍구'],
    imageURL: `${i}.jpg`,
  })
}

/*

const dummyPosts = []
for (let i = 1; i < 11; i++) {
  dummyPosts.push({
    _id: i,
    idx: i - 1,
    title: '제목 입니다 Lorrem Ipsum' + i,
    content: `참고로 ||을 사용한 두 번째 단락 평가의 경우, 최근 코드에서는 새로운 널 병합 연산자 (??)를 사용할 수도 있습니다. 널 병합 연산자는 첫 번째 연산자가 "널과 유사 (en-US)"한, 즉 null이거나 undefined일 때만 두 번째 피연산자를 반환합니다. ''와 0도 유효한 값이라면 널 병합 연산자가 기본 값을 나타낼 때 더 좋은 선택지입니다.`,
    createdAt: Date.now(),
    menu: 'sol',
    sub: 'album',
    category: '전체',
    like: i * 5,
    likeActive: true,
    comment: i * 5,
    imageURL: `${i}.jpg`,
  })
}
*/

const state = () => ({
  post: {},
  posts: dummyPosts,
})

const getters = {
  /* params: String (subMenu)  /
  /  return: Array            */
  getFilteredPosts: (state) => (sub) => {
    if (!sub) return state.posts
    else return state.posts.filter((post) => post.sub === sub)
  },
}

const actions = {
  // params: String (post ID)
  async getPost({ commit }, payload) {
    try {
      const response = await axios.get(`${process.env.VUE_APP_API_URL}posts/${payload}`)
      commit('SET_POST', response.data.post)
      return response.status
    } catch (err) {
      console.log(err.message)
    }
  },

  // params: none
  async getPosts({ commit }, payload) {
    try {
      const response = await axios.get(process.env.VUE_APP_API_URL + 'posts', { params: payload })
      commit('SET_POSTS', response.data.posts)
      return response.status
    } catch (err) {
      console.log(err.message)
    }
  },

  // params: Object (category, subject, content, tag)
  async createPost({ commit }, payload) {
    try {
      const response = await axios.post(process.env.VUE_APP_API_URL + 'post', payload)
      commit('UPDATE_POSTS', { action: 'create', data: response.data.post })
      return response.status
    } catch (err) {
      console.log(err.message)
    }
  },

  // params: Object (category, subject, content, tag)
  async editPost({ commit }, payload) {
    try {
      const response = await axios.put(`${process.env.VUE_APP_API_URL}/${payload._id}`, payload)
      commit('UPDATE_POSTS', { action: 'update', data: response.data.post })
      return response.status
    } catch (err) {
      console.log(err.message)
    }
  },

  // params: String (postId)
  async deletePost({ commit }, payload) {
    try {
      const response = await axios.delete(`${process.env.VUE_APP_API_URL}/${payload}`)
      commit('UPDATE_POSTS', { action: 'delete', data: response.data.post })
      return response.status
    } catch (err) {
      console.log(err.message)
    }
  },

  // params: Object
  /*
  async fileUpload({ commit }, payload) {
    try {
      const response = await axios.post(process.env.VUE_APP_API_URL + 'file', payload)
      return response.status
    } catch (err) {
      console.log(err.message)
    }
  },

  */
}

const mutations = {
  SET_POST(state, data) {
    state.post = data
  },

  SET_POST_TITLE(state, title) {
    state.post.title = title
  },

  SET_POST_CONTENT(state, content) {
    state.post.content = content
  },

  SET_POST_TAGS(state, tags) {
    state.post.tags = tags
  },

  SET_POST_STATE(state, obj) {
    state.post.menu = obj.menu
    state.post.sub = obj.sub
    state.post.category = obj.category
    state.post.isPrivate = obj.isPrivate ? true : false
  },

  UPDATE_POST_TAGS(state, tag) {
    tag = tag.replace(/,/g, '').trim()
    if (tag) {
      state.post.tags.push(tag)
    }
  },

  REMOVE_POST_TAG(state, index) {
    state.post.tags.splice(index, 1)
  },

  SET_POSTS(state, data) {
    state.posts = data
    state.posts.forEach((post, idx) => (post.idx = idx))
  },

  RESET_POSTS(state) {
    state.posts.length = 0
    state.posts = []
  },

  UPDATE_POSTS(state, { action, post }) {
    const newPosts = [...state.posts]

    if (!post) {
      return
    }

    if (action === 'create') {
      post.idx = newPosts.length
      newPosts.push(post)
    } else if (action === 'update') {
      newPosts[post.idx] = post
    } else if (action === 'delete') {
      newPosts.splice(post.idx, 1)
      for (let i = post.idx; i++; i < newPosts.length - 1) {
        newPosts[i].idx -= 1
      }
    }

    state.posts = newPosts
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
