import {Router} from "./router.js";

const menus = document.querySelectorAll('a[class="nav-link"]')
const contentContainer = document.querySelector('#contentApp')

const router = new Router(menus, contentContainer)
router.start()
