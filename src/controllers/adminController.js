const User = require('../models/User')


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
        const users = await User.find({}).select('name email role status createAt').sort({createdAt : -1})

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
