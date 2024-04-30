import {app} from "./settings";
import { runDb} from "./db/mongoDb";

 const port = 3000

const startApp=async ()=>{
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()


