import prisma from "../database/client.js"
import { includeRelations } from "../lib/utils.js"

const controller = {}

controller.create = async function (req, res) {
    try {
        const categoria = await prisma.categoria.create({
            data: req.body
        })
        res.status(201).json({
            message: "Categoria criada com sucesso",
            data: categoria
        })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Erro ao criar nova categoria: " + error.message
        })
    }
}

controller.retrieveAll = async function (req, res) {
    try {
        const categorias = await prisma.categoria.findMany({
            orderBy: {
                descricao: 'asc'
            },
            include: includeRelations(req.query)
        })
        res.status(200).json(categorias)
    }

    catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Erro ao buscar categorias: " + error.message
        })
    }
}

controller.retrieveOne = async function (req, res) {
    try {
        const categoria = await prisma.categoria.findUnique({
            where: { id: req.params.id },
            include: includeRelations(req.query)
        })

        if (!categoria) {
            return res.status(404).json({
                message: "Categoria não encontrada"
            })
        }

        res.status(200).json(categoria)
    }
    catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Erro ao buscar categoria: " + error.message
        })
    }
}

controller.update = async function (req, res) {
    try {
        const categoria = await prisma.categoria.update({
            where: { id: req.params.id },
            data: req.body
        })
        res.status(200).json({
            message: "Categoria atualizada com sucesso",
            data: categoria
        })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Erro ao atualizar categoria: " + error.message
        })
    }
}

controller.delete = async function (req, res) {
    try {
        await prisma.categoria.delete({
            where: { id: req.params.id }
        })

        res.status(204).end()
    }
    catch (error) {
        if (error?.code === 'P2025') {
            res.status(404).end()
        }
        else {
            console.error(error)
            res.status(500).send(error)
        }
    }
}


export default controller
