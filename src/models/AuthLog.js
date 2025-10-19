import mongoose from 'mongoose';

const AuthLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true  
    },
    username: {
        type: String,
        required: true,
        index: true  
    },
    action: {
        type: String,
        enum: [
            'login_success',
            'login_failed',
            'logout',
            'token_refresh',
            'token_revoked',
            'rate_limited',
            'password_change',
            'account_locked',
            'suspicious_activity'
        ],
        required: true,
        index: true  
    },
    ip: {
        type: String,
        required: true,
        index: true  
    },
    userAgent: {
        type: String
    },
    success: {
        type: Boolean,
        default: true,
        index: true  
    },
    failureReason: {
        type: String,
        enum: [
            'invalid_username',
            'invalid_password',
            'account_locked',
            'account_disabled',
            'token_expired',
            'token_revoked',
            'token_invalid',
            'rate_limited',
            'csrf_validation_failed',
            'unknown'
        ]
    },

    metadata: {
        type: mongoose.Schema.Types.Mixed
    },

    location: {
        country: String,
        city: String,
        region: String
    }
}, {
    timestamps: true
});


AuthLogSchema.index({ userId: 1, createdAt: -1 });
AuthLogSchema.index({ action: 1, createdAt: -1 });
AuthLogSchema.index({ success: 1, createdAt: -1 });



AuthLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); 

AuthLogSchema.statics.logEvent = async function (data) {
    try {
        return await this.create(data);
    } catch (error) {

        console.error('Failed to log auth event:', error);
        return null;
    }
};

AuthLogSchema.statics.getFailedLoginAttempts = async function (username, minutes = 15) {
    const since = new Date(Date.now() - minutes * 60 * 1000);

    return await this.countDocuments({
        username,
        action: 'login_failed',
        success: false,
        createdAt: { $gte: since }
    });
};

AuthLogSchema.statics.checkSuspiciousActivity = async function (username, minutes = 15) {
    const since = new Date(Date.now() - minutes * 60 * 1000);

    const failedAttempts = await this.aggregate([
        {
            $match: {
                username,
                action: 'login_failed',
                success: false,
                createdAt: { $gte: since }
            }
        },
        {
            $group: {
                _id: '$ip',
                count: { $sum: 1 }
            }
        }
    ]);

    const uniqueIPs = failedAttempts.length;
    const totalAttempts = failedAttempts.reduce((sum, ip) => sum + ip.count, 0);

    return {
        isSuspicious: uniqueIPs >= 3 && totalAttempts >= 10,
        uniqueIPs,
        totalAttempts,
        ips: failedAttempts
    };
};

AuthLogSchema.statics.getRecentActivity = async function (userId, limit = 20) {
    return await this.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
};

export default mongoose.models.AuthLog ||
    mongoose.model('AuthLog', AuthLogSchema);
