export default {
    build: {
      target: 'esnext', //browsers can handle the latest ES features
      rollupOptions: {
        input: {
          main: 'index.html',
          app: 'app.html',
        }
      }
    }
  }