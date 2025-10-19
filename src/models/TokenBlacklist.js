import mongoose from 'mongoose';

const TokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
        index: true  
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true  
    },
    reason: {
        type: String,
        enum: ['logout', 'password_change', 'security', 'admin_revoke', 'token_refresh'],
        default: 'logout'
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true  
    },

    revokedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ip: String,
    userAgent: String,
    notes: String
}, {
    timestamps: true
});



TokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


TokenBlacklistSchema.index({ userId: 1, createdAt: -1 });

TokenBlacklistSchema.statics.isBlacklisted = async function (token) {
    const result = await this.findOne({ token }).lean();
    return !!result;
};

TokenBlacklistSchema.statics.revokeToken = async function (token, userId, expiresAt, reason = 'logout', metadata = {}) {
    return await this.create({
        token,
        userId,
        expiresAt,
        reason,
        ...metadata
    });
};

TokenBlacklistSchema.statics.revokeAllUserTokens = async function (userId, tokens, reason = 'password_change') {
    const entries = tokens.map(({ token, expiresAt }) => ({
        token,
        userId,
        expiresAt,
        reason
    }));

    const result = await this.insertMany(entries, { ordered: false });
    return result.length;
};

export default mongoose.models.TokenBlacklist ||
    mongoose.model('TokenBlacklist', TokenBlacklistSchema);
