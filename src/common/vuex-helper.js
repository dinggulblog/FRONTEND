import { computed } from 'vue'
import { useStore } from 'vuex'

const mapState = (moduleName) => {
  const store = useStore()
  return Object.fromEntries(Object.keys(store.state[moduleName]).map((key) => [key, computed(() => store.state[moduleName][key])]))
}

const mapGetters = () => {
  const store = useStore()
  return Object.fromEntries(Object.keys(store.getters).map((getter) => [getter, computed(() => store.getters[getter])]))
}

const mapActions = () => {
  const store = useStore()
  return Object.fromEntries(Object.keys(store._actions).map((action) => [action, (value) => store.dispatch(action, value)]))
}

const mapMutations = () => {
  const store = useStore()
  return Object.fromEntries(Object.keys(store._mutations).map((mutation) => [mutation, (value) => store.commit(mutation, value)]))
}

export { mapState, mapGetters, mapActions, mapMutations }
