const User = require('../models/User')
const Product = require('../models/product')

exports.getPenddingVendors = async (req, res) => {
    try {
        const vendors = await User.find({
            role: 'vendor',
            status: 'pending'
        }).select('name email shopName shopAddress nidNumber createAt');

        return res.status(200).json({
            success: true,
            count: vendors.length,
            data: vendors
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

exports.getAllVendors = async (req, res) => {
    try {
        const vendors = await User.find({
            role: 'vendor',
        }).select('name email shopName status shopAddress approvedAt rejectReason nidNumber createAt');

        return res.status(200).json({
            success: true,
            count: vendors.length,
            data: vendors
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

exports.getApproveVendors = async (req, res) => {
    try {
        const vendors = await User.find({
            role: 'vendor',
            status: 'approve'
        }).select('name email shopName shopAddress nidNumber createAt approvedAt');

        return res.status(200).json({
            success: true,
            count: vendors.length,
            data: vendors
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

exports.getRejectedVendors = async (req, res) => {
    try {
        const vendors = await User.find({
            role: 'vendor',
            status: 'rejected'
        }).select('name email shopName shopAddress nidNumber createAt approvedAt rejectReason');

        return res.status(200).json({
            success: true,
            count: vendors.length,
            data: vendors
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

exports.approveVendor = async (req, res) => {
    try {
        const { vendorId } = req.params
        const vendor = await User.findById(vendorId)

        if (!vendor || vendor.role != 'vendor') {
            return res.status(400).json({
                success: false,
                message: 'Vendor not found.'
            })
        }

        vendor.status = 'approved'
        vendor.approvedAt = new Date()
        await vendor.save()


        // tudo send approval email

        return res.status(200).json({
            success: true,
            message: 'Vendor approved'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

exports.rejectVendor = async (req, res) => {
    try {
        const { id } = req.params
        const { reason } = req.body

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: 'Rejection reason is required'
            })
        }


        const vendor = await User.findOneAndUpdate(
            { _id: id, role: 'vendor', status: 'pending' },
            {
                status: 'rejected',
                rejectReason: reason,
                approvedAt: null
            },
            { new: true }
        ).select('name email shopName status rejectReason')

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found or already approved'
            });
        }

        // tudo send approval email with reason
        return res.status(200).json({
            success: false,
            message: 'Vendor rejected successfully',
            data: vendor
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

// All Users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('name email role status createAt').sort({ createdAt: -1 })

        return res.status(200).json({
            success: false,
            count: users.length,
            data: users
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

exports.getAdminStats = async (req, res) => {
    try {
        const [tolalUsers, totalCustomer, vendorStats, pendingVendors,
            rejectedVendors, approveVendor, suspendedVendors] = await Promise.all([
                // tolal user
                User.countDocuments({}),

                // total customer
                User.countDocuments({ role: 'customer' }),

                // Vendor breakdown using aggegation pipelin
                user.aggregate([
                    { $match: { role: 'vendor' } },
                    {
                        $group: {
                            _id: null,
                            totalVendors: { $sum: 1 },
                            approved: {
                                $sum: {
                                    $cond: [{ $eq: ['$status', 'approved'] }, 1, 0]
                                }
                            },
                            pending: {
                                $sum: {
                                    $cond: [{ $eq: ['$status', 'pending'] }, 1, 0]
                                }
                            },
                            rejected: {
                                $sum: {
                                    $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0]
                                }
                            },
                            suspended: {
                                $sum: {
                                    $cond: [{ $eq: ['$status', 'suspended'] }, 1, 0]
                                }
                            }
                        }
                    }
                ]),

                // Pending Vendor
                User.countDocuments({ role: 'vendor', status: 'pending' }),

                // Rejected Vendor
                User.countDocuments({ role: 'vendor', status: 'rejected' }),

                // Approved Vendor
                User.countDocuments({ role: 'vendor', status: 'approved' }),

                // Suspended Vendor
                User.countDocuments({ role: 'vendor', status: 'suspended' }),
            ])

        const vendorBreakdown = vendorStats[0] || {
            totalVendors: 0,
            approved: 0,
            pending: 0,
            rejected: 0,
            suspended: 0
        }

        const stats = {
            overview: {
                totalUser,
                totalCustomer,
                totalVendors: vendorBreadown.totalVendors,
            },
            vendors: {
                approved: vendorBreakdown.approved || approveVendor,
                pending: vendorBreakdown.pending || pendingVendors,
                rejected: vendorBreakdown.rejected || rejectedVendors,
                suspended: vendorBreakdown.suspended || suspendedVendors
            },
            newRegistrationToday: await User.countDocuments({
                createdAt: {
                    $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                }
            }),
            timestamp: new Date().toISOString()
        }

        return res.status(200).json({
            success: true,
            data: stats
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}


// Get all Pending Product
exports.getPendingProduct = async (req, res) => {
    try {
        const products = await Product.find({ status: 'pending' })
            .populate('vendor', 'name shopName email')
            .sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            count: product.length,
            products
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}

// Approve porduct
exports.approveProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findByIdAndUpdate(
            id,
            { status: 'approved' },
            { new: true }
        ).populate('vendor', 'shopName email')

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        // todo: vendor ke email pathabo je approve hoise

        return res.status(200).json({
            success: true,
            message: 'Product approved successfully'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}

// 
exports.rejectProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { reason } = req.body

        if (!reason) {
            return res.status(404).json({
                success: false,
                message: 'Rejection reason required'
            })
        }

        const product = await Product.findByIdAndUpdate(
            id,
            {
                status: 'rejected',
                rejectedReason: reason,
                reviwedBy: req.user.id
            },
            { new: true }
        )

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        // todo: vendor k email pathabe je rejected hoise

        return res.status(200).json({
            success: true,
            message: 'Product rejected',
            product
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}
