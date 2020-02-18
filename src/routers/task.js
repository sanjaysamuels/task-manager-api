const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const authentication = require('../middleware/authentication')

router.post('/tasks', authentication, async (req, res) => {
    //const task = new Task(req.body)

    const task = new Task({
        ...req.body,
        creator: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


// GET: completed 
// GET: limit and skip {{url}}/tasks?limit=2&skip=2
// GET: SORTING {{url}}/tasks?sortBy=createdAt:desc
router.get('/tasks', authentication, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'

    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'asc' ? 1:-1
    }

    try {
        //const tasks = await Task.find({creator: req.user._id})
        await req.user.populate({
            path: 'tasks', 
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', authentication, async (req, res) => {

    const _id = req.params.id
    try {
        const task = await Task.findOne({_id, creator: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
        console.log(e)
    }
})

router.patch('/tasks/:id', authentication, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const ValidOperation = updates.every((update) => allowedUpdates.includes(update))

    const _id = req.params.id

    if (!ValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findOne({_id, creator: req.user._id})


        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => {
            task[update] = req.body[update]  // req.body has the entire set to be updated eg { description: 'Be productive' }
        })

        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', authentication, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, creator: req.user._id})

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router