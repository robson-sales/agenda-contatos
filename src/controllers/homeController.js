const HomeModel = require('../models/HomeModel');
const Contato = require('../models/ContatoModel');

exports.index = async (req, res) => {
    const contatos = await Contato.buscaContatos();
    // const contatos = await Contato.buscaContatos(req.session.user._id); filtra por ID
    res.render('index', { title: 'Agenda | Home', contatos });
};