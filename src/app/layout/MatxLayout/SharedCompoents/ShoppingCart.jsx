import React, { Fragment, useState } from "react";
import { Icon, Badge, IconButton, Drawer, Button } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  getCartList,
  deleteProductFromCart,
  updateCartAmount,
} from "../../../redux/actions/EcommerceActions";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import useSettings from "../../../hooks/useSettings";
import useAuth from "../../../hooks/useAuth";

const useStyles = makeStyles(({ palette, ...theme }) => ({
  miniCart: {
    width: "var(--sidenav-width)",
    "& .cart__topbar": {
      height: "var(--topbar-height)",
    },
    "& .mini-cart__item": {
      transition: "background 300ms ease",
      "&:hover": {
        background: "rgba(0,0,0,0.01)",
      },
    },
  },
}));

let cartListLoaded = false;

function ShoppingCart({ container }) {
  const [totalCost, setTotalCost] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);

  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { user } = useAuth();
  const { cartList } = useSelector((state) => state.ecommerce);
  const { settings } = useSettings();

  if (!cartListLoaded) {
    //dispatch(getCartList(user.id));
    cartListLoaded = true;
  }

  const handleDrawerToggle = () => {
    setPanelOpen(!panelOpen);
  };

  const handleCheckoutClick = () => {
    if (totalCost > 0) {
      history.push("/ecommerce/checkout");
      setPanelOpen(false);
    }
  };

  useEffect(() => {
    let total = 0;

    cartList.forEach((product) => {
      total += product.price * product.amount;
    });

    setTotalCost(total);
  }, [cartList]);

  return (
    <Fragment>
      <div>CART</div>
    </Fragment>
  );
}

export default ShoppingCart;
