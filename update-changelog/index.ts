// import { error as logError, getInput, setFailed } from '@actions/core'
import { context } from '@actions/github'
// import { EventPayloads } from '@octokit/webhooks'
// import { OctoKitIssue } from '../api/octokit'
import { Action } from '../common/Action'
import { exec } from '@actions/exec'
import { cloneRepo } from '../common/git'
// import fs from 'fs'
import { OctoKit } from '../api/octokit'
import { EventPayloads } from '@octokit/webhooks'

class UpdateChangelog extends Action {
	id = 'UpdateChangelog'

	async onTriggered(octokit: OctoKit) {
		const { owner, repo } = context.repo
		const token = this.getToken()
		const payload = context.payload as EventPayloads.WebhookPayloadWorkflowDispatch
		const version = (payload.inputs as any).version

		if (!version) {
			throw new Error('Missing version input')
		}

		await cloneRepo({ token, owner, repo })

		process.chdir(repo)

		const base = context.ref.substring(context.ref.lastIndexOf('/') + 1)
		const prBranch = `version-bump-${version}`

		// create branch
		await git('switch', base)
		await git('switch', '--create', prBranch)
	}
}

const git = async (...args: string[]) => {
	// await exec('git', args, { cwd: repo })
	await exec('git', args)
}

new UpdateChangelog().run() // eslint-disable-line