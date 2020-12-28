<template>
    <div class="typewriter">
        <span class="title is-size-1">
            {{ printedText }}
        </span>
    </div>
</template>

<script>
export default {
    props: ['text'],
    data() {
        return {
            printedText: '',
            textIndexPos: 0
        }
    },
    methods: {
        typeText() {

            // each interval, get character at next index and add to printedText
            if(this.textIndexPos < this.text.length){
                this.printedText = this.printedText + this.text[this.textIndexPos]
                this.textIndexPos++
                setTimeout( () => { this.typeText() }, 500 )
            }
        }
    },
    mounted() {
        this.typeText()
    }

}
</script>

<style scoped>

.typewriter {
  overflow: hidden; /* Ensures the content is not revealed until the animation */
  border-right: .15em solid #4896ca; /* The typwriter cursor */
  border-radius: 2px;
  border-width: .1em;
  white-space: nowrap; /* Keeps the content on a single line */
  margin: 0 auto; /* Gives that scrolling effect as the typing happens */
  letter-spacing: .10em; /* Adjust as needed */
  /* animation: 
    startAnimation 1s,
    typing 3s steps(21, end) 0.8s, */
    /* typing2 0.5s steps(5, end) 2.5s,
    typing3 2s steps(12, end) 3s, */
    /* blink-caret .75s step-end infinite; */
}

/* The typing effect */
@keyframes startAnimation {
  from { opacity: 0%; width: 0}
  to { opacity: 100%; width: 0}
}

@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

@keyframes typing2 {
  from { width: 50% }
  to { width: 30% }
}

@keyframes typing3 {
  from { width: 30% }
  to { width: 100% }
}

/* The typewriter cursor effect */
@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: #017282; }
}

</style>