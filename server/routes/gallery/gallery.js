const express = require('express');
const router = express.Router();
const Gallery = require('../../models/gallery');

const labels = {
    totalDocs: 'totalCount',
    docs: 'list',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'next',
    prevPage: 'prev',
    totalPages: 'pageCount',
    hasPrevPage: 'hasPrev',
    hasNextPage: 'hasNext',
    pagingCounter: 'pageCounter'
};

const list = async (req, res) => {
    try {
        const { page, limit } = { ...req.query };
        const query = Gallery.aggregate().sort({ "createdAt": -1 });
        const response = await Gallery.aggregatePaginate(query, { page: page, limit: limit, customLabels: labels });
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const add = async (req, res) => {
    try {
        const { body = null } = req ;
        if (body) {
            const galleries = new Gallery(body);
            await galleries.save();
            res.status(200).json({ message: `Add successfully` });
        } else {
            res.status(400).json({ message: `Error on addition of new gallery` });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const deleteGallery = async (req, res) => {
    try {
        const { _id = null } = { ...req.params };
        if (_id) {
            await Gallery.findOneAndRemove({ _id });
            res.status(200).json({ message: `Deleted successfully` });
        } else {
            res.status(400).json({ message: `Error on Deletion` });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


// routes
router.get('/list', list);
router.post('/', add);
router.delete('/:_id', deleteGallery);
module.exports = router;