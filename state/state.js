
//store.js
export default {
  namespaced: true,
  state: {
    user: null,
    loading: false,
		vipDay:0,
		msgCount:0
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
		setVipDay(state,value){
			state.vipDay = value;
		},
		setMsgCount(state,value){
			state.msgCount = value;
		},
  },
	getters:{
		vipDay:(state)=>state.vipDay,
		msgCount:(state)=>state.msgCount,
	},
  actions: {
    async login({ commit }, { loginId, loginPwd }) {
      commit("setLoading", true);
      const user = await userServ.login(loginId, loginPwd);
      commit("setUser", user);
      commit("setLoading", false);
      return user;
    },
    async loginOut({ commit }) {
      commit("setLoading", true);
      await userServ.loginOut();
      commit("setUser", null);
      commit("setLoading", false);
    },
    async whoAmI({ commit }) {
      commit("setLoading", true);
      const user = await userServ.whoAmI();
      commit("setUser", user);
      commit("setLoading", false);
    },
		vipDay({ commit },value) {
		  commit("setVipDay", value);
		},
		msgCount({ commit },value) {
		  commit("setMsgCount", value);
		},
  },
};

