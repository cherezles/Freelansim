const isAuth = async body => body.match(/<a class="avatar"/) ? true : false;

const getBodyPage = async () => {
	const TASKS_SEARCH_URL = `https://freelansim.ru/tasks${localStorage.params || ''}`;
	return await fetch(TASKS_SEARCH_URL).then(e => e.text())
};

const getFirstTaskId = async body => {
	try {
		return parseInt(body.match(/href="\/tasks\/\d+/)[0].match(/\d+/)[0])
	} catch (e) {
		return 0	
	}
};

const getTaskById = async id => {
	const taskBody = await fetch(`https://freelansim.ru/tasks/${id}`).then(e => e.text())

	const content = taskBody.match(/<meta content='[^']+/gi)

	const title = content[0].replace("<meta content='", '')
		, description = content[1].replace("<meta content='", '')
	
	return {
		title, 
		description
	}
}

const checkNewNotify = async body => {
	const notify = body.match(/<div class='counter'>(\d+?)<\/div>/gi)
		, notifyCount = notify ? parseInt(notify[0].match(/\d+/)[0]) : 0

	if (notifyCount > 0) {
		const s_notifyCount = notifyCount.toString()
		if (localStorage.notifyCount != s_notifyCount) {
			localStorage.notifyCount = s_notifyCount
			return true
		}
	} else {
		localStorage.notifyCount = '0'
	}

	return false
}

const checkNewTask = async body => {
	const old_tasks = JSON.parse(localStorage.old_tasks || '[]')

	const id = await getFirstTaskId(body)

	if (!old_tasks.includes(id) && id != 0) {
		old_tasks.push(id)
		localStorage.old_tasks = JSON.stringify(old_tasks)

		return {
			...await getTaskById(id),
			id
		}
	}

	return false
}

class CounterNotify {
	constructor () {
		this.counter = 0
	}

	render (text) {
		chrome.browserAction.setBadgeText({
			text: text.toString()
		})
	}

	add () {
		this.counter++
		this.render(this.counter)
	}

	clear () {
		this.counter = 0
		this.render('')
	}	
}

const counterNotify = new CounterNotify()


const main = async tasks => {
	
	const body = await getBodyPage()

	const newTask = await checkNewTask(body)

	if (newTask) {
		const { id, title, description } = newTask;
		(new Notification(title, {
			body: description,
			icon: 'https://freelansim.ru/images/logo.png'
		})).onclick = () => {
			window.open(`https://freelansim.ru/tasks/${id}`, '_blank')
		}
	}

	if (await isAuth(body) && localStorage.notify == 'true') {
		if (await checkNewNotify(body)) {
			counterNotify.add();
			(new Notification('Новый отклик!', {
				icon: 'https://freelansim.ru/images/logo.png'
			})).onclick = () => {
				counterNotify.clear();
				window.open('https://freelansim.ru/my/responses', '_blank')
			}
		}
	}

};

main()

setInterval(() => {
	if (localStorage.params != localStorage.old_params) {
		localStorage.old_params = localStorage.params
		main()
	}
}, 1000)

setInterval(main, 30000)

chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
		window.open('https://github.com/JsusDev/Freelansim', '_blank')	
    }else if(details.reason == "update"){
        window.open('https://github.com/JsusDev/Freelansim', '_blank')
    }
});

chrome.browserAction.setBadgeBackgroundColor({
	color: '#ea7e5d'
})

chrome.runtime.onMessage.addListener(() => {
	counterNotify.clear()
});