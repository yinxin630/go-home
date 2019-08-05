import * as vscode from 'vscode';
import * as deepcopy from 'deepcopy';

const allConfig = vscode.workspace.getConfiguration();
const config = allConfig.gohome;

const GetOffMessage = '已经下班啦~ 赶紧滚回家去';
const NotificationMessage = '到点啦~ 该下班了!';

/** 获取提示消息 */
function getMessage() {
    const now = new Date();
    const goHome = new Date();
    goHome.setHours(config.hour);
    goHome.setMinutes(config.minute);
    goHome.setSeconds(0);
    
	const duration = goHome.getTime() - now.getTime();
    if (duration <= 0) {
        return GetOffMessage;
    }

    const hour = Math.floor(duration / 1000 / 60 / 60);
    const minute = Math.floor(duration / 1000 / 60 % 60);
    const second = Math.floor(duration / 1000 % 60);

    return `>> 距离下班还有 ${hour ? hour + '小时' : ''}${minute ? minute + '分钟' : ''}${second ? second + '秒' : ''}`;
}

/** 是否已经提醒过下班 */
let isGetOff = false;

export function activate(context: vscode.ExtensionContext) {
	const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);

	myStatusBarItem.text = getMessage(),
	myStatusBarItem.show();

	setInterval(() => {
		const newMessage = getMessage();
		myStatusBarItem.text = newMessage;
		if (newMessage === GetOffMessage) {
			if (!isGetOff) {
				vscode.window.showInformationMessage(NotificationMessage);
				isGetOff = true;
			}
		} else {
			isGetOff = false;
		}
	}, 1000);

	context.subscriptions.push(myStatusBarItem);
}

export function deactivate() {}
