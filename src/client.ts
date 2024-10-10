import { App } from './app'

document.addEventListener("touchmove", function(e) {
  if (e.changedTouches[0].pageY < 0) {
      e.preventDefault();
      document.dispatchEvent(new Event('touchend'))
  }
})

const app = new App()
app.init()
animate()

function animate() {
  requestAnimationFrame( animate )
  app.update()
}
