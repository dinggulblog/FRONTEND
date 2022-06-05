import axios from "axios";

const dummyComments = {
  _id: 1,
  _pid: 1,
  author: "master",
  content:
    "대댓글은 댓글에 댓글을 다는 것입니다. 즉 댓글과 대댓글이 연결되어 있다는 정보를 어딘가 저장해야 하는데, 이를 위해 comment 모델에 parentComment항목을 만들었죠.",
  createdAt: Date.now(),
  isDeleted: false,
  children: [
    {
      _id: 2,
      _pid: 1,
      parentComment: 1,
      author: "ming",
      content:
        "이런식으로 부모, 자식 관계가 있는 데이터가 배열에 한줄로 나열된 것을 flat(평평한) 배열이라고 합니다. 위 데이터 처럼 배열의 요소들이 부모-자식 관계에 있는 경우, 아래와 같이 부모-자식을 엮어서 표현할 수 있습니다.",
      createdAt: Date.now(),
      isDeleted: false,
      children: [],
    },
    {
      _id: 3,
      _pid: 1,
      parentComment: 1,
      author: "master",
      content:
        "DB에는 댓글들이 flat한 형태로 저장되어 있기 때문에 댓글들을 구조에 맞게 웹페이지에 표시하려면 먼저 tree 구조로 변환하는 코드가 필요하고, 두번째로 tree 구조를 render할 수 있는 view도 필요합니다.",
      createdAt: Date.now(),
      isDeleted: false,
      children: [
        {
          _id: 4,
          _pid: 1,
          parentComment: 3,
          author: "sol",
          content:
            "댓글이 동일한 구조의 댓글을 하위 항목으로 가지므로 댓글 view 역시 댓글 view안에 다시 댓글 view가 들어가게 만들어야 합니다. 즉 댓글 view를 partial로 만들고, 댓글에 대댓글이 있는 경우 자기 자신인 댓글 view를 원래 댓글 view안에 가지고 있어야 하는 거죠. 이러한 개념을 recursive라고 하는데요, 우선 이해를 돕기 위해 recursive 함수를 예로 들어 보겠습니다.",
          createdAt: Date.now(),
          isDeleted: false,
          children: [],
        },
      ],
    },
  ],
};
const dummyComments2 = {
  _id: 5,
  _pid: 1,
  author: "sol",
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl tincidunt eget nullam non.",
  createdAt: Date.now(),
  isDeleted: false,
  children: [
    {
      _id: 6,
      _pid: 1,
      parentComment: 5,
      author: "ming",
      content:
        "Quis hendrerit dolor magna eget est lorem ipsum dolor sit. Volutpat odio facilisis mauris sit amet massa. Commodo odio aenean sed adipiscing diam donec adipiscing tristique.",
      createdAt: Date.now(),
      isDeleted: false,
      children: [],
    },
  ],
};

const dummyComments3 = {
  _id: 5,
  _pid: 1,
  author: "sol",
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl tincidunt eget nullam non.",
  createdAt: Date.now(),
  isDeleted: false,
  children: [
    {
      _id: 6,
      _pid: 1,
      parentComment: 5,
      author: "ming",
      content:
        "Quis hendrerit dolor magna eget est lorem ipsum dolor sit. Volutpat odio facilisis mauris sit amet massa. Commodo odio aenean sed adipiscing diam donec adipiscing tristique.",
      createdAt: Date.now(),
      isDeleted: false,
      children: [],
    },
  ],
};

const state = () => ({
  comment: {},
  comments: [dummyComments, dummyComments2, dummyComments3],
});

const getters = {};

const actions = {
  // params: Object
  async commentWrite({ commit }, payload) {
    try {
      const response = await axios.post(process.env.VUE_APP_API_URL, payload);
      commit("updateCommentData", {
        action: "create",
        data: response.data.comment,
      });
      return response.data.comment;
    } catch (err) {
      console.log(err.message);
    }
  },

  // params: Object (commentId)
  async commentEdit({ commit }, payload) {
    try {
      const response = await axios.put(
        `${process.env.VUE_APP_API_URL}/${payload.commentId}`,
        payload
      );
      commit("updateCommentData", {
        action: "update",
        data: response.data.comment,
      });
      return response.data.comment;
    } catch (err) {
      console.log(err.message);
    }
  },

  // params: String (commentId)
  async commentDel({ commit }, payload) {
    try {
      const response = await axios.delete(
        `${process.env.VUE_APP_API_URL}/${payload}`
      );
      commit("updateCommentData", {
        action: "delete",
        data: response.data.comment,
      });
      return response.data.comment;
    } catch (err) {
      console.log(err.message);
    }
  },
};

const mutations = {
  setCommentData(state, data) {
    state.commentData = [...data];
  },

  setCommentItem(state, data) {
    state.commentItem = data;
  },

  delCommentData(state) {
    state.commentData.length = 0;
  },

  updateCommentData(state, action, data) {
    const newCommentData = [...state.commentData];
    if (action === "create") {
      newCommentData.push(data);
    } else {
      const idx = state.commentData.findIndex(
        (comment) => comment._id === data._id
      );
      if (idx !== -1) {
        if (action === "update") {
          newCommentData[idx] = data;
        } else if (action === "delete") {
          delete newCommentData[idx];
        }
      }
    }
    state.commentData = newCommentData;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
