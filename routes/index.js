import userRoutes from './user.js';
import artistRoutes from './artists.js';


const constructor = (app) => {
    app.use('/user', userRoutes);
    app.use('/artist', artistRoutes);


    app.use('*', (req, res) => {
        res.status(404).json({error: 'Route Not Found'});
    });
};

export default constructor;