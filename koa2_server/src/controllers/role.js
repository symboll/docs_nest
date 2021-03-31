const roleModel = require('../models/role')
const { Success, Exception } = require('../util/res_model')

class Role {

  async list(ctx) { 
    const { query } = ctx.request
    let res = {} 
    if(Object.keys(query).length === 0) {
      res.count = 0
      res.count = await roleModel.countDocuments()
      if(res.count) {
        res.roles = await roleModel.find().sort({ createdAt: 'desc' })
      }
      ctx.body = new Success({ data: res })
    } else {
      res.roles = []
      const result = await roleModel.findOne(query)
      res.roles.push(result)
      ctx.body = new Success({ data: res })
    }
  }

  async create (ctx) {
    const { name, auth, level } = ctx.request.body
    if(!name || !auth) { 
      throw new Exception({ message: 'name or auth 必填!' })
    }
    const role = await roleModel.findOne({name})
    if(role) {
      throw new Exception({ message: '角色已存在!' })
    }
    try {
      await roleModel.create({ name, auth, level })
      ctx.body = new Success({})
      ctx.status = 201
    }catch (e) {
      throw new Exception({ message: '创建失败!'+ e })
    }
  }

  async update(ctx) {
    const id = ctx.params.id
    const { body } = ctx.request
    if(Object.keys(body) === 0) {
      throw new Exception({ message: '缺失更新参数!' })
    }
    const role = await roleModel.findById(id)
    const updateRole = Object.assign(role, body)
    const { name, auth,level } = updateRole
    try {
      await roleModel.findByIdAndUpdate(id, { name, auth, level })
      ctx.body = new Success({})
    }catch (e) {
      throw new Exception({ message: '更新失败!'+ e })
    }
  }

  async remove(ctx) {
    const id = ctx.params.id
    try {
      await roleModel.findByIdAndRemove(id)
      ctx.body = new Success({})
    }catch (e) {
      throw new Exception({ message: '删除失败!'+ e })
    }
  }
}

module.exports = Role