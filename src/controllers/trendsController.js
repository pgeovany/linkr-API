import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import trendsRepository from '../repositories/trendsRepository.js';

async function getTrends(req, res) {
    try {
        const rows = await trendsRepository.getTrends();
        res.status(200).send(rows);
    } catch (err) {
        res.status(500).send(err);
    }
}

async function getTrendByName(req, res) {
    const { name } = req.params;
    try {
        const rows = await trendsRepository.getTrendsByName(name);
        res.status(200).send(rows);
    } catch (err) {
        res.status(500).send(err);
    }
}

export { getTrends, getTrendByName };