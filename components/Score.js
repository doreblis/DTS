Vue.component('Stopwatch', {
    data () {
      return {
        running: false,
        currentTime: false,
        previousTime: 0,
        formattedTime: "00:00:00"
      }
    },
    
    methods: {
      calculate (timestamp) {
        this.previousTime = this.previousTime + (timestamp - this.currentTime)
        
        let prevDate = new Date(this.previousTime)
  
        let minutes = (prevDate.getMinutes()).toFixed(0).padStart(2, '0')
        let seconds = (prevDate.getSeconds()).toFixed(0).padStart(2, '0')
        let milliseconds = Math.floor(prevDate.getMilliseconds() / 10).toFixed(0).padStart(2, '0')
  
        let pretty = minutes + ":" + seconds + ":" + milliseconds
  
        this.formattedTime = pretty
      },
  
      onTick (timestamp) {
        if (!this.running) return
        this.calculate(timestamp)
        this.currentTime = timestamp
        requestAnimationFrame(this.onTick)
      },
      
      onStop () {
        this.currentTime = null
        this.running = false
      },
  
      onStart () {
        if (!this.currentTime) this.currentTime = performance.now()
        this.running = true
        requestAnimationFrame(this.onTick)
      },
  
      onReset () {
        this.onStop()
        this.previousTime = 0
        this.formattedTime = "00:00:00"
      }
    },
    
    template: `
      <div class="stopwatch">
        <h2>Stopwatch</h2>
        <div class="stopwatch-time">{{ formattedTime }}</div>
        <button @click="onStart" v-if="!running">Start</button>
        <button @click="onStop" v-else>Stop</button>
        <button @click="onReset">Reset</button>
      </div>
    `
  })
  
  Vue.component('AddPlayerForm', {
    data () {
      return {
        name: ''
      }
    },
    
    methods: {
      onSubmit () {
        this.$emit("onPlayerAdd", this.name)
        this.name = ""
      }
    },
    
    template: `
      <div class="add-player-form">
        <form @submit.prevent="onSubmit">
          <input type="text" v-model="name" />
          <input type="submit" value="Add Player" />
        </form>
      </div>
    `
  })
  
  Vue.component('Stats', {
    props: {
      players: {
        type: Array,
        required: true
      }
    },
    
    computed: {
      totalPlayers () {
        return this.players.length
      },
  
      totalScore () {
        return this.players.reduce((total, player) => {
          return total += player.score
        }, 0)
      }
    },
    
    template: `
      <table class="stats">
        <tbody>
          <tr>
            <td>Players:</td>
            <td>{{ totalPlayers }}</td>
          </tr>
           <tr>
            <td>Total Score:</td>
            <td>{{ totalScore }}</td>
          </tr>
        </tbody>
      </table>
    `
  })
  
  Vue.component('PageHeader', {
    props: {
      title: {
        type: String,
        required: true
      },
      players: {
        type: Array,
        required: true
      }
    },
    template: `
      <div class="header">
        <stats :players="players"></stats>
        <h1>{{ title }}</h1>
        <stopwatch></stopwatch>
      </div>
    `
  })
  
  Vue.component('Counter', {
    props: {
      score: {
        type: Number,
        required: true
      }
    },
    
    methods: {
      changeScore (delta) {
        this.$emit('onScoreChange', delta)
      }
    },
  
    template: `
      <div class="counter">
        <button class="counter-action decrement" @click="changeScore(-1)"> - </button>
        <div class="counter-score"> {{ score }} </div>
        <button class="counter-action increment" @click="changeScore(+1)"> + </button>
      </div>
    `
  })
  
  Vue.component('Player', {
    props: {
      name: {
        type: String,
        required: true
      },
      score: {
        type: String,
        required: true
      }
    },
    
    methods: {
      changeScore (delta) {
        this.$emit('onScoreChange', delta)
      }
    },
    
    template: `
      <div class="player">
        <div class="player-name">
          <a class="remove-player" @click="$emit('onRemove')">❌</a>
          {{ name }}
        </div>
        <div class="player-score">
          <counter :score="this.score" @onScoreChange="changeScore"></counter>
        </div>
      </div>
    `
  })
  
  Vue.component('Scoreboard', {
    data () {
      return {
        nextID: 4,
        players: [
          {
            name: "Blantz",
            score: 9,
            id: 1,
          },
          {
            name: "Pekse",
            score: 8,
            id: 2,
          },
          {
            name: "Tiborcio",
            score: 7,
            id: 3,
          }
        ],
        title: "Scoreboard"
      }
    },
    
    methods: {
      changeScore (index, delta) {
        this.players[index].score += delta
      },
  
      addPlayer (name) {
        this.players.push({
          name: name,
          score: 0,
          id: this.nextID
        })
        this.nextID += 1
      },
  
      removePlayer (index) {
        this.players.splice(index, 1)
      },
    },
    
    template: `
      <div class="scoreboard">
        <page-header :title="title" :players="players" />
  
        <div class="players">
          <Player
            v-for="(player, index) in players"
            :name="player.name"
            :score="player.score"
            :key="player.id"
            @onScoreChange="(delta) => changeScore(index, delta)"
            @onRemove="removePlayer(index)"
          />
        </div>
  
        <add-player-form @onPlayerAdd="addPlayer" />
      </div>
    `
  })
  
  const app = new Vue({
    el: '#app'
  })