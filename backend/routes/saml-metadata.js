import express from 'express'
import passport from '../saml-auth.js'

const router = express.Router()

router.get('/', (req, res) => {
    const samlStrategy = passport._strategies.saml;
    if (samlStrategy) {
        res.type('application/xml').send(samlStrategy.generateServiceProviderMetadata());
    } else {
        res.status(500).send('Saml strategy not found')
    }
    
    
});

router.get('/test', (req, res) => {
    res.send('Metadatae route is active')
})
export default router;