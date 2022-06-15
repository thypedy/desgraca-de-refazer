const atividades = require("../models/atividades")

module.exports = (app) => {
    app.post('/atividades', async (req, res) => {
        let dados = req.body
        //return console.log(dados)

        // conectar com o database
        const database = require("../config/database")()

        //importar o model atividades
        const atividades = require("../models/atividades")

        //gravar as infomações do formulario no database

        let gravar = await new atividades({
            data: dados.data,
            tipo: dados.tipo,
            entrega: dados.entrega,
            disciplina: dados.disciplina,
            instrucoes: dados.orientacoes,
            usuario: dados.id,
            titulo: dados.titulo
        }).save()

        //recarregar a pagina atividades
        res.redirect('/atividades?id=' + dados.id)

    })
    app.get('/atividades', async (req, res) => {
        //listar todas as atividades do usuario logado
        var user = req.query.id
        if(!user){
            res.redirect("/login")
        }
        var usuarios = require('../models/usuario')
        var atividades = require("../models/atividades")

        var dadosUser = await usuarios.findOne({ _id:user })

        var dadosAberto = await atividades.find({ usuarios: user,status: "0"}).sort({data:1})

        var dadosEntregue = await atividades.find({ usuarios: user,status: "1"}).sort({data:1})

        var dadosExcluido = await atividades.find({ usuarios: user,status: "2"}).sort({data:1})

        res.render('atividades.ejs',{
            nome:dadosUser.nome,
            id:dadosUser._id,
            dadosAberto,
            dadosEntregue,
            dadosExcluido
        })
        // res.render('atividades.ejs', {
        //     nome: dadosUser.nome,
        //     id: dadosUser._id,
        //     lista: dadosAtividades
        // })
    })

    app.get('/excluir',async(req,res)=>{
        //qual documento será excluido da collection atividades?
        var doc = req.query.id

        //excluir o documento
        var excluir = await atividades.findByIdAndUpdate(
            {_id:doc},
            {status:"2"}
        )

        //voltar para a lista de atividades
        res.redirect("/atividades?id="+excluir.usuario)
    })

    app.get('/entregue',async(req,res)=>{
        //qual documento será excluido da collection atividades?
        var doc = req.query.id

        //excluir o documento
        var entregue = await atividades.findByIdAndUpdate(
            {_id:doc},
            {status:"1"}
        )

        //voltar para a lista de atividades
        res.redirect("/atividades?id="+entregue.usuario)
    })

        //rota desfazer
    app.get('/desfazer',async(req,res)=>{
        //qual documento será devolvido da collection atividades?
        var doc = req.query.id

        //excluir o documento
        var desfazer = await atividades.findByIdAndUpdate(
            {_id:doc},
            {status:"0"}
        )

        //voltar para a lista de atividades
        res.redirect("/atividades?id="+desfazer.usuario)
    })
}